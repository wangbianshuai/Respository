import * as Common from "../utils/Common"

export function GetFetch(url) {
    return fetch(GetFullUrl(url)).then(res => res.json())
}

export function PostFetch(url, data) {
    return fetch(GetFullUrl(url), {
        method: "POST",
        body: JSON.stringify(data)
    }).then(res => res.json())
}

function GetFullUrl(url) {
    url = GetRootPath() + url
    return Common.AddUrlRandom(url)
}

function GetRootPath() {
    return "http://localhost:8081/api/"
}
