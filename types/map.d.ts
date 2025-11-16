import type { Length } from "convert/dist/types/units";

import type L from "leaflet";
import type { DivIcon } from "leaflet";
import type { EventRef, Events } from "obsidian";
import type { MarkerIcon, SavedMarkerProperties, SavedOverlayData } from ".";

import type { Marker } from ".";
import type { ObsidianAppData, TooltipDisplay } from "./saved";
import type { Overlay } from "../src/layer";
import type { Layer } from "../src/layer/layer";
// import type { GPXControl } from "./controls";
import type { LeafletRenderer } from "../src/renderer/renderer";
import { DrawingController } from "../src/draw/controller";
import { ShapeProperties } from "../src/draw/shape";
import type geojson from "geojson";
import type ObsidianAlexandria from "../src/main";

export interface ImageLayerData {
    data: string;
    alias: string;
    id: string;
    h: number;
    w: number;
}

export interface GeoJSONLayerData {
    data: geojson.GeoJsonObject;
    alias: string;
    id: string;
}

export interface LayerGroup<T extends L.TileLayer | L.ImageOverlay | L.GeoJSON> {
    /** Layer group containing the marker layer groups */
    group: L.LayerGroup;

    /** Marker type layer groups (used to filter out marker types) */
    markers: { [type: string]: L.LayerGroup };
    /** Marker type layer groups (used to filter out marker types) */
    overlays: { [type: string]: L.LayerGroup };

    /** Actual rendered map layer */
    layer: T;

    /** Reference ID */
    id: string;

    /** Only used for image maps -> actual image map data as base64 */
    /* data: string ;*/

    /** Only used for image maps -> dimensions of image */
    dimensions?: [number, number];

    /** Alias */
    alias?: string;
}

export interface MarkerDivIconOptions extends L.DivIconOptions {
    data?: { [key: string]: string };
}

export interface DivIconMarkerOptions extends L.MarkerOptions {
    icon: MarkerDivIcon;
}
export interface LeafletMapOptions {
    bounds?: [[number, number], [number, number]];
    context?: string;
    darkMode?: boolean;
    defaultZoom?: number;
    distanceMultiplier?: number;

    draw?: boolean;
    drawColor?: string;

    geojsonColor?: string;

    localMarkerTypes?: MarkerIcon[];

    hasAdditional?: boolean;
    height?: string;
    width?: string;
    id?: string;
    imageOverlays?: {
        alias: string;
        bounds: [[number, number], [number, number]];
        data: string;
        id: string;
    }[];

    isInitiativeView?: boolean;
    isMapView: boolean;

    layers?: string[];

    lock?: boolean;

    maxZoom?: number;
    minZoom?: number;

    noUI?: boolean;
    noScrollZoom?: boolean;

    osmLayer?: boolean;

    overlayColor?: string;
    overlayTag?: string;

    recenter?: boolean;

    scale?: number;

    unit?: string;

    tileLayer?: string[];
    tileOverlay?: string[];

    tileSubdomains: string[];

    type?: "image" | "real" | "geojson";
    verbose?: boolean;
    zoomDelta?: number;
    zoomFeatures?: boolean;
    zoomMarkers?: boolean;
}

declare class Popup {
    leafletInstance: L.Popup;
    handlerTarget: any;
    options: L.PopupOptions;
    constructor(
        map: BaseMapType,
        target: Layer<any> | L.LatLng | L.Polyline,
        options?: L.PopupOptions
    );
    open(
        content: ((source: L.Layer) => L.Content) | L.Content,
        handler?: L.Layer
    ): void;
    close(): void;
    isOpen(): boolean;
    setContent(content: ((source: L.Layer) => L.Content) | L.Content): void;
    setLatLng(latlng: L.LatLng): void;
    setTarget(target: Layer<any> | L.LatLng | L.Polyline): Popup;
}

declare abstract class BaseMap /* <
    T extends L.ImageOverlay | L.TileLayer
> */
    extends Events
{
    abstract render(options: {
        coords: [number, number];
        zoomDistance: number;
        imageOverlayData?: {
            id: string;
            data: string;
            alias: string;
            bounds: [[number, number], [number, number]];
        }[];
    }): Promise<void>;
    abstract type: string;
    abstract get bounds(): L.LatLngBounds;
    abstract get scale(): number;
    abstract get CRS(): L.CRS;

    constructor(renderer: LeafletRenderer, options: LeafletMapOptions);

    canvas: L.Canvas;

    controller: DrawingController;

    get currentGroup(): LayerGroup<L.TileLayer | L.ImageOverlay | L.GeoJSON>;
    contentEl: HTMLElement;
    currentLayer: L.ImageOverlay | L.TileLayer | L.GeoJSON;

    get data(): ObsidianAppData;
    get defaultIcon(): MarkerIcon;

    displaying: Map<string, boolean>;
    get displayed(): Marker[];
    distanceAlongPolylines(polylines: L.Polyline[]): string;
    drawingLayer: L.LayerGroup;

    featureLayer: L.FeatureGroup;

    geojsonData: any[];


    get id(): string;

    initialCoords: [number, number];

    isDrawing: boolean;
    get isFullscreen(): boolean;

    leafletInstance: L.Map;
    mapLayers: LayerGroup<L.TileLayer | L.ImageOverlay | L.GeoJSON>[];

    markers: Marker[];
    get markerIcons(): Map<string, MarkerIcon>;
    get markerTypes(): string[];

    options: LeafletMapOptions;
    overlays: Overlay[];

    get plugin(): ObsidianAlexandria;

    popup: Popup;
    previousDistanceLines: L.Polyline[];

    readyForDrawings: boolean;

    renderer: LeafletRenderer;
    rendered: boolean;

    tempCircle: L.Circle;

    verbose: boolean;

    zoom: {
        min: number;
        max: number;
        default: number;
        delta: number;
    };
    zoomDistance: number;

    unit: Length;

    /** Marker Methods */
    addMarker(...markers: SavedMarkerProperties[]): Marker[];

    createMarker(
        type: string,
        loc: [number, number],
        percent: [number, number],
        id: string,
        link?: string,
        layer?: string,
        mutable?: boolean,
        command?: boolean,
        description?: string,
        minZoom?: number,
        maxZoom?: number,
        tooltip?: TooltipDisplay
    ): Marker;

    onMarkerClick(marker: Marker, evt: L.LeafletMouseEvent): void;

    updateMarker(marker: Marker): void;

    /** Overlay Methods */
    addOverlay(...overlays: SavedOverlayData[]): void;
    createOverlay(overlay: SavedOverlayData): void;
    beginOverlayDrawingContext(
        original: L.LeafletMouseEvent,
        marker?: Marker
    ): void;

    /** Other Methods */
    addShapes(...shapes: ShapeProperties[]): void;
    closePopup(popup: L.Popup): void;
    distance(latlng1: L.LatLng, latlng2: L.LatLng): string;
    getMarkersById(id: string): Marker[];
    getOverlaysUnderClick(evt: L.LeafletMouseEvent): Overlay[];
    getZoom(): number;
    handleMapContext(evt: L.LeafletMouseEvent, overlay?: Overlay): void;
    isLayerRendered(layer: string): boolean;

    loadFeatureData(data: {
        geojsonData: { data: geojson.GeoJsonObject; alias?: string }[];
    }): void;

    log(text: string): void;
    registerScope(): void;
    remove(): void;
    removeMarker(marker: Marker): void;
    resetZoom(): void;
    unregisterScope(): void;
    abstract setInitialCoords(coords: [number, number]): void;

    sortOverlays(): void;
    setZoomByDistance(zoomDistance: number): void;
    startDrawingContext(): void;
    stopDrawingContext(): void;
    toProperties(): SavedMapData;
    updateMarkerIcons(): void;

    updateLockState(state: boolean): void;

    zoomAllMarkers(): void;

    on(name: "removed", callback: () => void): EventRef;
    on(
        name: "layer-ready-for-features",
        callback: (layer: string) => void
    ): EventRef;
    on(name: "first-layer-ready", callback: (layer: string) => void): EventRef;
    on(
        name: "create-immutable-layer",
        callback: (layer: Marker | Overlay) => Promise<void>
    ): EventRef;
    on(name: "should-save", callback: () => void): EventRef;
    on(name: "marker-added", callback: (marker: Marker) => void): EventRef;
    on(name: "marker-dragging", callback: (marker: Marker) => void): EventRef;
    on(
        name: "marker-data-updated",
        callback: (marker: Marker) => void
    ): EventRef;
    on(name: "marker-updated", callback: (marker: Marker) => void): EventRef;
    on(name: "marker-deleted", callback: (marker: Marker) => void): EventRef;
    on(name: "markers-updated", callback: () => void): EventRef;
    on(name: "should-close-popup", callback: (source: Popup) => void): EventRef;
    on(name: "should-sagpxve", callback: () => void): EventRef;
    on(name: "lock", callback: () => void): EventRef;
    on(name: "ready-for-drawings", callback: () => void): EventRef;
    on(name: "click", callback: () => void): EventRef;
}

declare class RealMap extends BaseMap /* <L.TileLayer> */ {
    CRS: L.CRS;
    type: string;
    constructor(renderer: LeafletRenderer, options: LeafletMapOptions);

    get bounds(): L.LatLngBounds;

    get scale(): number;

    setInitialCoords(coords: [number, number]): void;

    render(options: {
        coords: [number, number];
        zoomDistance: number;
        imageOverlayData?: {
            id: string;
            data: string;
            alias: string;
            bounds: [[number, number], [number, number]];
        }[];
    }): Promise<void>;
}

declare class ImageMap extends BaseMap /* <L.ImageOverlay> */ {
    CRS: L.CRS;
    type: string;
    constructor(renderer: LeafletRenderer, options: LeafletMapOptions);

    get bounds(): L.LatLngBounds;

    get scale(): number;

    setInitialCoords(coords: [number, number]): void;

    render(options: {
        coords: [number, number];
        zoomDistance: number;
        imageOverlayData?: {
            id: string;
            data: string;
            alias: string;
            bounds: [[number, number], [number, number]];
        }[];
    }): Promise<void>;

    buildLayer(layer: ImageLayerData): Promise<void>;
}

declare class AzgaarMap extends BaseMap /* <L.GeoJSON> */ {
    CRS: L.CRS;
    type: string;
    constructor(renderer: LeafletRenderer, options: LeafletMapOptions);

    get bounds(): L.LatLngBounds;

    get scale(): number;

    setInitialCoords(coords: [number, number]): void;

    render(options: {
        coords: [number, number];
        zoomDistance: number;
        imageOverlayData?: {
            id: string;
            data: string;
            alias: string;
        }[];
    }): Promise<void>;
    buildLayer(layer: GeoJSONLayerData): Promise<void>;

}

export type BaseMapType = RealMap | ImageMap | AzgaarMap;

export interface SavedMapData {
    id: string;
    locked: boolean;
    lastAccessed: number;
    markers: SavedMarkerProperties[];
    overlays: SavedOverlayData[];
    shapes: ShapeProperties[];
}

declare class MarkerDivIcon extends DivIcon {
    options: MarkerDivIconOptions;
    div: HTMLElement;
    constructor(options: MarkerDivIconOptions);
    createIcon(oldIcon: HTMLElement): HTMLElement;
    setData(data: { [key: string]: string }): void;
}

declare class DivIconMarker extends L.Marker {
    options: DivIconMarkerOptions;
    constructor(
        latlng: L.LatLng,
        options: L.MarkerOptions,
        data: { [key: string]: string }
    );
}

declare class DistanceDisplay extends L.Control {
    controlEl: HTMLElement;
    textEl: HTMLSpanElement;
    get lines(): L.Polyline[];
    map: BaseMapType;
    popups: Popup[];
    constructor(opts: L.ControlOptions, map: BaseMapType);
    initEvents(): void;
    onMouseEnter(): void;
    onClick(evt: MouseEvent): void;
    onMouseLeave(): void;
    onAdd(map: L.Map): HTMLElement;
    setText(text: string): void;
}
