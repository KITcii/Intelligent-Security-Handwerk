import { cn, degreesToRadians } from "@/lib/utils";
import { Point2D } from "@/types/assistant";
import React, { useMemo } from "react";
import style from "./SpiderDiagram.module.css";

const calculateEdgePointsFn =
  (
    radius: number,
    viewBoxCenterX: number,
    viewBoxCenterY: number,
    numberOfCircles: number,
    numberOfCrossLines: number,
    degreeBetweenCrossLines: number,
    values: number[]
  ) =>
  (): Array<{
    circles: Point2D[];
    value: Point2D;
    label: Point2D;
  }> => {
    const calculateEdgePoint = (
      centerX: number,
      centerY: number,
      value: number,
      radius: number,
      degreeInRadians: number
    ): Point2D => {
      return [
        centerX + Math.cos(degreeInRadians) * radius * value,
        centerY + Math.sin(degreeInRadians) * radius * value,
      ] as Point2D;
    };

    const results = [];
    for (let i = 0; i < numberOfCrossLines; i++) {
      const result: { circles: Point2D[]; value: Point2D; label: Point2D } = {
        circles: [],
        value: [0, 0],
        label: [0, 0],
      };
      for (let j = 0; j < numberOfCircles; j++) {
        result.circles.push(
          calculateEdgePoint(
            viewBoxCenterX,
            viewBoxCenterY,
            (j + 1) / numberOfCircles,
            radius,
            degreesToRadians(i * degreeBetweenCrossLines - 90)
          )
        );
      }
      result.value = calculateEdgePoint(
        viewBoxCenterX,
        viewBoxCenterY,
        values[i],
        radius,
        degreesToRadians(i * degreeBetweenCrossLines - 90)
      );

      result.label = calculateEdgePoint(
        viewBoxCenterX,
        viewBoxCenterY,
        1.1,
        radius,
        degreesToRadians(i * degreeBetweenCrossLines - 90)
      );

      results.push(result);
    }
    return results;
  };

const SpiderDiagram = ({
  data,
  height = 90,
  width = 120,
  circles = 5,
  radiusScale = 0.3,
  className,
}: {
  data: { label: string; value: number; display: number }[];
  height?: number;
  width?: number;
  circles?: number;
  radiusScale?: number;
  className?: string;
}) => {
  const numberOfCircles = Math.abs(circles);
  const numberOfCrossLines = data.length;

  const degreeBetweenCrossLines = 360 / numberOfCrossLines;
  const viewBoxCenterX = width * 0.5;
  const viewBoxCenterY = height * 0.5;
  const radius =
    Math.min(width, height) *
    (radiusScale <= 0 || radiusScale > 1 ? 1 : radiusScale);
  const scales = data.map((area) => {
    return area.display;
  });

  // Memorize costly function for calculating the line intersection
  const edgePoints = useMemo(
    () =>
      calculateEdgePointsFn(
        radius,
        viewBoxCenterX,
        viewBoxCenterY,
        numberOfCircles,
        numberOfCrossLines,
        degreeBetweenCrossLines,
        scales
      ),
    [
      radius,
      viewBoxCenterX,
      viewBoxCenterY,
      numberOfCircles,
      numberOfCrossLines,
      degreeBetweenCrossLines,
      scales,
    ]
  );

  // Calculate the horizontal alignment of the label depending on the angle of the corresponding cross line
  const calculateLabelAnchor = (degree: number) => {
    if (degree > 0 && degree < 180) return "start";
    else if (degree > 180 && degree < 360) return "end";
    return "middle"; // 0 or 360
  };

  // Calculate the vertical alignment of the label depending on the angle of the corresponding cross line
  const calculateLabelBaseline = (degree: number) => {
    if (degree === 90 || degree === 270) return "middle";
    else if (degree > 90 && degree < 270) return "hanging";
    else return "baseline"; // 0, 360, >0<90, >270<360
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("spiderDiagram", className)}
    >
      {/* Draw encircling borders */}
      {Array.from({ length: numberOfCircles }).map((it, i) => (
        <polygon
          key={`poly_outline_${i}`}
          points={edgePoints()
            .map((ep) => {
              return `${ep.circles[i][0]},${ep.circles[i][1]} `;
            })
            .toString()}
          className={style.spiderCircle}
        />
      ))}
      {/* Draw cross lines */}
      {edgePoints().map((ep, i) => (
        <line
          key={`crosshair_${i}`}
          x1={viewBoxCenterX}
          y1={viewBoxCenterY}
          x2={ep.circles[ep.circles.length - 1][0]}
          y2={ep.circles[ep.circles.length - 1][1]}
          className={style.spiderCrossLine}
        />
      ))}

      {/* Draw polygon that visualizes the data array */}
      <polygon
        className={style.spiderFill}
        points={`${edgePoints()
          .map((ep) => {
            return `${ep.value[0]},${ep.value[1]} `;
          })
          .toString()}`}
      />

      {/* Draw cross line labels */}
      {data.map((r, i) => {
        return (
          <g key={`label_group_${i}`}>
            <text
              key={`label_${i}`}
              className={cn(
                style.spiderText,
                r.display === 0 && "opacity-50",
                "spiderLabel"
              )}
              textAnchor={calculateLabelAnchor(i * degreeBetweenCrossLines)}
              alignmentBaseline={calculateLabelBaseline(
                i * degreeBetweenCrossLines
              )}
              x={edgePoints()[i].label[0]}
              y={edgePoints()[i].label[1]}
            >
              {r.label}
            </text>
            <circle
              key={`spiderMarker_${i}`}
              cx={edgePoints()[i].value[0]}
              cy={edgePoints()[i].value[1]}
              r="3"
              className={style.spiderMarker}
              style={{ opacity: 0 }}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default SpiderDiagram;
