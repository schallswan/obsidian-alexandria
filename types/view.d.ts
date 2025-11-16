import { ItemView, MarkdownRenderChild, WorkspaceLeaf } from "obsidian";

import type ObsidianAlexandria from "../src/main";
import { BaseMapType } from "./map";

export class LeafletMapView extends ItemView {
    map: BaseMapType;
    mapEl: HTMLDivElement;
    innerContentEl: HTMLDivElement;
    context: MarkdownRenderChild;
    constructor(leaf: WorkspaceLeaf, plugin: ObsidianAlexandria);
    onOpen(): Promise<void>;
    update(): void;
    getDisplayText(): string;
    getViewType(): string;
    onResize(): void;
}
