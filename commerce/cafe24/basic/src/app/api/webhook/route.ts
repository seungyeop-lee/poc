export async function POST(
    request: Request
) {
    const {searchParams} = new URL(request.url);
    console.log('Search Params:', Object.fromEntries(searchParams));

    const headers = Object.fromEntries(request.headers);
    console.log('Request Headers:', headers);

    const body = await request.text();
    console.log('Request Body:', body);

    return new Response('OK', {status: 200});
}
