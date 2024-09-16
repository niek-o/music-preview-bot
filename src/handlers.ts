import { defaultTransformers } from "@lilybird/transformers";
import { Handler } from "@lilybird/handlers/advanced";

import type { DefaultTransformers } from "@lilybird/transformers";

export const handler = new Handler<DefaultTransformers, true>({
    cachePath: `${import.meta.dir}/lily-cache/handler`,
    transformers: defaultTransformers
});

export const $applicationCommand = handler.storeCommand.bind(handler);
export const $globalCommands = handler.loadGlobalCommands.bind(handler);
export const $listener = handler.storeListener.bind(handler);
export const $component = handler.buttonCollector.bind(handler);
