((ns) => {
    const { Common } = ns.utils

    ns.api.Index = class Index {
        constructor(options) {
            this.Id = Common.CreateGuid()

            options && Object.assign(this, options)
        }

        PostFetch(url, data) {
            return fetch(this.GetFullUrl(url, data), {
                method: "POST",
                body: JSON.stringify(data)
            }).then(res => this.SetResult(res).then(d => this.GetResponse(d)))
        }

        PostStreamFetch(url, data) {
            return fetch(Common.AddUrlRandom(url), {
                method: "POST",
                headers: { "Content-Type": "application/octet-stream" },
                body: data
            }).then(res => this.SetResult(res).then(d => this.GetResponse(d)))
        }

        GetResponse(res) {
            if (res && res.Ack) {
                if (res.Ack.IsSuccess) {
                    return Promise.resolve(res.Data)
                }
                else if (res.Ack.StatusMessage) {
                    return Promise.reject(res.Ack.StatusMessage)
                }
            }

            return Promise.reject("请求异常！")
        }

        SetResult(res) {
            return res.ok ? res.json() : Promise.reject(res.status + ":" + (!res.statusText ? "请求错误！" : res.statusText))
        }

        GetFullUrl(url, data) {
            url = this.GetRootPath() + url
            if (data.EntityName === "UserLogin") {
                data.EntityName = "User";
                url = Common.AddURLParameter(url, "IsLogin", "true");
            }
            else {
                let userId = Common.GetStorage("LoginUserId");
                if (!userId) Common.ToLogin();
                url = Common.AddURLParameter(url, "LoginUserId", userId);
            }
            return Common.AddUrlRandom(url)
        }

        GetRootPath() {
            return "api/"
        }

    }

})($ns);