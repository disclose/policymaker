<template>
    <div id="app">
        <header>
            <div class="logo">
                <img src="@/assets/images/logo-disclose-type.svg">
            </div>

            <nav>
                <Progress-Steps>
                    <Progress-Step :index="1" route="/policymaker">Introduction</Progress-Step>
                    <Progress-Step :index="2" route="/policymaker/organisation">Organization details</Progress-Step>
                    <Progress-Step :index="3" route="/policymaker/settings">Policy settings</Progress-Step>
                    <Progress-Step :index="4" route="/policymaker/download">Download</Progress-Step>
                </Progress-Steps>

            </nav>
        </header>


        <main>
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


header {
    --nav-width: 320px;
    width: var(--nav-width);
    background: var(--white);
    @apply pt-8 pb-8;
}

nav {
    @apply mt-12;
}

main {
    background: var(--shade-050);
    @apply flex-grow;
    @apply pt-8 pb-8 pl-8;
}

.logo {

}

</style>
