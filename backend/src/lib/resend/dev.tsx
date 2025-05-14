import { pretty, render } from "@react-email/components";
import { ClipsReady } from "./templates/clip-ready-template";

const RenderTemplate = async () => {
    const html = await pretty(await render(<ClipsReady url="https://www.google.com/" email="test@email.com"/>))
    console.log(html)
}

RenderTemplate()