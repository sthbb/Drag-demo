import { request } from "@/utils/request";
class Api {
  async previewCSharpCode(json) {
    const res = await request.post("/wfcode/preview", {
      json: json,
    });
    console.log(res, "res");
    return res.data;
  }
}
export default new Api();
