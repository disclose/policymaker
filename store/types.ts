
// Input Channel types
export type Channels = Channel[]
export type Channel = {
    type: string,
    prefix: string,
    address: string
}

export type UpdateChannelRequest = {
    channel: Channel,
    index: number
}

export type TemplateType = keyof VDPTemplateSet
export type SetTemplateTextRequest = {
    language: string,
    type: TemplateType,
    text: string
}

// Policy configuration store
export type PolicyConfiguration = {
    language: string,
    region?: string,
    organizationName: string,
    organizationDomain: string,
    channels: Channels,
    cvdTimelineDays: number,
    hostUrl: Channel
}

// Navigation route steps
export type NavSteps = NavStep[]
export type NavStep = {
    route: string,
    name: string
}


// Dropdown types
export type DropdownOptions = DropdownOption[]
export type DropdownOption = {
    value: any,
    label: string
}

// Template sources
export type TemplateSources = Record<string, TemplateSource>
export type TemplateSource = {
    url: string,
    text: string
}

export type Templates = {
    vdp: {
        [lang: string]: VDPTemplateSet
    },
    securitytxt: {
        base: TemplateSource
    }
}
export type VDPLanguageTemplateSet = {
    language: string,
    templates: VDPTemplateSet
}

export type VDPTemplateSet = {
    base: string,
    with_cvd: string,
    safe_harbor: string
}