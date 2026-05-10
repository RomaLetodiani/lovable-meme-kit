import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KImage, Rect, Circle, Text, Transformer } from "react-konva";
import type Konva from "konva";

export type CanvasAnchor =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | { x: number; y: number };

export interface TemplateConfig {
  /** URL of the template image (background subject like old-man.png, stonks-guy, etc). */
  src: string;
  /** Render width of the template inside the stage. Height auto-scaled to image aspect ratio. */
  width: number;
  /** Where the template anchors on the stage. */
  anchor: CanvasAnchor;
}

export interface HotspotConfig {
  /** Stable id for the hotspot. */
  id: string;
  /** Initial position + size of the user-image placeholder. */
  initialPosition: { x: number; y: number; w: number; h: number };
  /** Shape of the placeholder shown when no image is loaded. */
  placeholderShape?: "circle" | "rect";
  /** Caption shown inside the placeholder. Default "Drop image". */
  placeholderText?: string;
  /** User image data URL (or null to show placeholder). */
  image: string | null;
  /** Whether the user image can be dragged. Default true. */
  draggable?: boolean;
  /** Whether the user image can be rotated/scaled via transformer. Default true. */
  transformable?: boolean;
}

export interface TemplateMemeCanvasProps {
  width: number;
  height: number;
  /** Background color. Use `"transparent"` for no fill (parent should render checker pattern). */
  bgColor: string;
  /** The static template image config. Optional — apps without a template can omit. */
  template?: TemplateConfig;
  /** User-image hotspots. Currently 1 supported; multi-hotspot is future scope. */
  hotspots: HotspotConfig[];
  /** Stage ref for export / outside-react access. */
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

/** Internal: load an image URL into an HTMLImageElement and trigger re-render when ready. */
function useImage(src: string | null | undefined): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => setImg(image);
    image.src = src;
  }, [src]);
  return img;
}

function resolveAnchor(
  anchor: CanvasAnchor,
  stageW: number,
  stageH: number,
  w: number,
  h: number,
): { x: number; y: number } {
  if (typeof anchor === "object") return { x: anchor.x, y: anchor.y };
  switch (anchor) {
    case "top-left":
      return { x: 0, y: 0 };
    case "top-right":
      return { x: stageW - w, y: 0 };
    case "bottom-left":
      return { x: 0, y: stageH - h };
    case "bottom-right":
      return { x: stageW - w, y: stageH - h };
    case "center":
      return { x: (stageW - w) / 2, y: (stageH - h) / 2 };
  }
}

interface HotspotNodeProps {
  config: HotspotConfig;
  isSelected: boolean;
  onSelect: () => void;
}

function HotspotNode({ config, isSelected, onSelect }: HotspotNodeProps) {
  const img = useImage(config.image);
  const shapeRef = useRef<Konva.Image | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const draggable = config.draggable ?? true;
  const transformable = config.transformable ?? true;

  useEffect(() => {
    if (isSelected && transformable && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, transformable, img]);

  const { x, y, w, h } = config.initialPosition;

  if (!config.image || !img) {
    const text = config.placeholderText ?? "Drop image";
    if (config.placeholderShape === "circle") {
      const r = Math.min(w, h) / 2;
      return (
        <>
          <Circle
            x={x + w / 2}
            y={y + h / 2}
            radius={r}
            stroke="#888"
            strokeWidth={2}
            dash={[6, 4]}
          />
          <Text
            x={x}
            y={y + h / 2 - 6}
            width={w}
            align="center"
            text={text}
            fontSize={12}
            fill="#888"
          />
        </>
      );
    }
    return (
      <>
        <Rect x={x} y={y} width={w} height={h} stroke="#888" strokeWidth={2} dash={[6, 4]} />
        <Text
          x={x}
          y={y + h / 2 - 6}
          width={w}
          align="center"
          text={text}
          fontSize={12}
          fill="#888"
        />
      </>
    );
  }

  return (
    <>
      <KImage
        ref={shapeRef}
        image={img}
        x={x}
        y={y}
        width={w}
        height={h}
        name="hotspot-image"
        data-hotspot-id={config.id}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
      />
      {isSelected && transformable ? (
        <Transformer
          ref={trRef}
          rotateEnabled
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
          }
        />
      ) : null}
    </>
  );
}

/**
 * Konva-based composition canvas for meme generators with a static template +
 * one or more draggable user-image hotspots.
 *
 * Used by Old Man Yells At, Stonks-ify, GOAT-ify, and similar "subject + template
 * overlay" meme apps. App-specific code provides the template asset URL +
 * hotspot positions; the kit owns Konva orchestration (stage, layer, transformer,
 * draggable behavior, click-to-deselect, draw cycle).
 */
export function TemplateMemeCanvas({
  width,
  height,
  bgColor,
  template,
  hotspots,
  stageRef,
}: TemplateMemeCanvasProps) {
  const templateImg = useImage(template?.src);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  let templatePos = { x: 0, y: 0 };
  let templateH = 0;
  if (template && templateImg) {
    const aspect = templateImg.naturalHeight / templateImg.naturalWidth;
    templateH = template.width * aspect;
    templatePos = resolveAnchor(template.anchor, width, height, template.width, templateH);
  }

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }
    // Clicking the template (non-hotspot) also deselects.
    const name = e.target.name?.();
    if (name === "template-image") {
      setSelectedId(null);
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={handleStageMouseDown}
      onTouchStart={handleStageMouseDown}
    >
      <Layer>
        {bgColor !== "transparent" ? (
          <Rect id="bg-rect" x={0} y={0} width={width} height={height} fill={bgColor} />
        ) : null}
        {template && templateImg ? (
          <KImage
            id="template"
            name="template-image"
            image={templateImg}
            x={templatePos.x}
            y={templatePos.y}
            width={template.width}
            height={templateH}
            listening
          />
        ) : null}
        {hotspots.map((h) => (
          <HotspotNode
            key={h.id}
            config={h}
            isSelected={selectedId === h.id}
            onSelect={() => setSelectedId(h.id)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
