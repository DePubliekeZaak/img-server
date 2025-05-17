import got from 'got';
export const node = async (endpoint, body) => {
    return await got.post('http://0.0.0.0:3009/' + endpoint, {
        json: body,
        timeout: {
            request: 1000 * 1000
        }
    })
        .json();
};
