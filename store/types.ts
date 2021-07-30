
type Channel = {
    type: string,
    address: string
}

type Channels = Channel[]


type SetTemplateTextRequest = {
    type: string,
    text: string
}

type PolicyConfiguration = {
    language: string,
    region: string,
    organizationName: string,
    channels: Channels,
    cvdTimelineDays: number,
    hostUrl: Channel
}