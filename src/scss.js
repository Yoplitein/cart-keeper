document.addEventListener(
    "DOMContentLoaded",
    async function()
    {
        async function getSourceOf(url)
        {
            return (await fetch(url)).text();
        }
        
        const scssCompile = src => new Promise(resolve => Sass.compile(src, resolve));
        
        for(const script of document.querySelectorAll("script[type='text/scss+import']"))
        {
            const unqualifiedName = script.attributes["src"].value; //script.src gives absolute URI
            const src = await getSourceOf(script.src);
            
            Sass.writeFile(unqualifiedName, src);
        }
        
        for(const script of document.querySelectorAll("script[type='text/scss']"))
        {
            const scssSource = script.src != "" ?
                await getSourceOf(script.src) :
                script.innerHTML
            ;
            const compiled = await scssCompile(scssSource);
            
            if(compiled.status != 0)
                throw new Error(`Failed to compile ${script.src}: ${compiled.formatted}\n${scssSource}`);
            
            const stylesheet = document.createElement("style");
            stylesheet.type = "text/css";
            stylesheet.innerHTML = compiled.text;
            
            script.parentNode.insertBefore(stylesheet, script.nextSibiling);
        }
    }
);
