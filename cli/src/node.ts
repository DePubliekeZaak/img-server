import got from 'got';

export const node = async (endpoint: string, body: any) => {

    return await got.post('http://0.0.0.0:3099/' + endpoint, { 
        json: body, 
        timeout: {
            request: 21000
        }})
        .json();
}