import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Dialog from "./Dialog.vue";

describe("Dialog", () => {
  it("renders overlay and content with proper z-index classes", async () => {
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: {
        title: "删除确认"
      },
      slots: {
        trigger: "<button>打开弹窗</button>",
        default: "<p>测试内容</p>"
      }
    });

    await wrapper.get("button").trigger("click");

    const html = document.body.innerHTML;
    expect(html).toContain("fixed inset-0 z-40 bg-black/30");
    expect(html).toContain("z-50");

    wrapper.unmount();
  });
});
