import { createPluginRegistration } from "@embedpdf/core";
import { DocumentManagerPluginPackage } from "@embedpdf/plugin-document-manager";
import { RenderPluginPackage } from "@embedpdf/plugin-render";
import { ScrollPluginPackage } from "@embedpdf/plugin-scroll";
import { ViewportPluginPackage } from "@embedpdf/plugin-viewport";
import { ZoomMode, ZoomPluginPackage } from "@embedpdf/plugin-zoom/react";
import { TilingPluginPackage } from "@embedpdf/plugin-tiling/react";
import { AnnotationPluginPackage } from "@embedpdf/plugin-annotation/react";
import { SelectionPluginPackage } from "@embedpdf/plugin-selection/react";
import { InteractionManagerPluginPackage } from "@embedpdf/plugin-interaction-manager";
import { BookmarkPluginPackage } from "@embedpdf/plugin-bookmark/react";
import { RotatePluginPackage } from "@embedpdf/plugin-rotate/react";
import { ExportPluginPackage } from "@embedpdf/plugin-export/react";
import { PanPluginPackage } from "@embedpdf/plugin-pan/react";
import { SearchPluginPackage } from "@embedpdf/plugin-search/react";
import { CapturePluginPackage } from "@embedpdf/plugin-capture/react";
import { Rotation } from "@embedpdf/models";
export const plugins = [
  createPluginRegistration(DocumentManagerPluginPackage,),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(BookmarkPluginPackage),
  createPluginRegistration(ViewportPluginPackage),
  createPluginRegistration(ScrollPluginPackage),
  createPluginRegistration(TilingPluginPackage, {
    tileSize: 768,
    overlapPx: 5,
    extraRings: 3,
  }),
  createPluginRegistration(InteractionManagerPluginPackage, {
    exclusionRules: { dataAttributes: ["data-selection-menu"] },
  }),
  createPluginRegistration(ZoomPluginPackage, {
    defaultZoomLevel: ZoomMode.Automatic,
    presets: [
      { name: "Automatic", value: ZoomMode["Automatic"] },
      { name: "Fit Page", value: ZoomMode["FitPage"] },
      { name: "Fit Width", value: ZoomMode["FitWidth"] },
      { name: "100%", value: 1 },
      { name: "200%", value: 2 },
      { name: "300%", value: 3 },
      { name: "400%", value: 4 },
    ],
  }),
  createPluginRegistration(PanPluginPackage, { defaultMode: "mobile" }),
  createPluginRegistration(SelectionPluginPackage),
  createPluginRegistration(AnnotationPluginPackage, {
    selectAfterCreate: false,
    autoCommit: false,
  }),
  createPluginRegistration(RotatePluginPackage, {
    defaultRotation: Rotation.Degree0,
  }),
  createPluginRegistration(ExportPluginPackage),
  createPluginRegistration(SearchPluginPackage),
  createPluginRegistration(CapturePluginPackage, {
    withAnnotations: true,
    scale: 5,
    imageType: "image/png",
  }),
];
