<template>
    <div id="app">
        <nav>
            <div>disclose.io</div>

            <Progress-Steps>
                <Progress-Step :index="1" route="/policymaker">Introduction</Progress-Step>
                <Progress-Step :index="2" route="/policymaker/organisation">Organization details</Progress-Step>
                <Progress-Step :index="3" route="/policymaker/settings">Policy settings</Progress-Step>
                <Progress-Step :index="4" route="/policymaker/download">Download</Progress-Step>
            </Progress-Steps>

        </nav>

        <main>
            <header>
                Mobile header
            </header>
            <Nuxt />          
        </main>
    </div>



</template>

<style lang="postcss">
:root {
    color: var(--dark-purple);
    background: linear-gradient(90deg, var(--white) 50%, var(--shade-050) 50%);
    /* font-family: "Noto Sans", Roboto, "Helvetica Neue", ui-sans-serif, system-ui, -apple-system, system-ui; */
    font-family: "Noto Sans";
}

#app {
    @apply container mx-auto h-screen;
    @apply flex flex-1 flex-row flex-nowrap items-stretch justify-between;
}


nav {
    --nav-width: 320px;
    width: var(--nav-width);
    background: var(--white);
}

main {
    background: var(--shade-050);
    @apply flex-grow;
}
</style>
