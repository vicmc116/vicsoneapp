export async function handler(event) {
    const key = event.headers.authorization;

    if (!key || key !== process.env.ADMIN_KEY2) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
    };
}