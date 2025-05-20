import {defineEventHandler, getRequestHeaders, readMultipartFormData} from "h3";
import {v4 as uuidv4} from "uuid";
import stor from "@nuxthub/core";

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);

    if (!session?.user?.channelId) {
        throw createError({
            statusCode: 401,
            message: "Unauthorized",
        });
    }

    const files = await readMultipartFormData(event);
    if (!files?.length) {
        throw createError({
            statusCode: 400,
            message: "No file uploaded",
        });
    }

    const file = files[0];
    if (!file.type?.startsWith("image/")) {
        throw createError({
            statusCode: 400,
            message: "Invalid file type",
        });
    }

    const uuid = uuidv4();
    const ext = file.filename?.split(".").pop() || "png";
    const key = `${session.user.channelId}/${uuid}.${ext}`;
    const storage = hubBlob()

    await storage.put(key, file.data, {
        contentType: file.type,
    });

    return {
        url: `/storage/${key}`,
        fileName: file.filename,
    };
});