export default defineEventHandler(async (event) => {
    const { filename } = event.context.params as { filename: string };
    const storage = hubBlob()

    const blob = await storage.get(filename)

    if (!blob) {
        throw createError({
            statusCode: 404,
            message: 'File not found'
        });
    }

    return blob;
});