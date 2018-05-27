document.addEventListener(
    "DOMContentLoaded",
    async function()
    {
        const pathPrefix = (document.querySelector("meta[name='scss-prefix']") || {"content": ""}).content;
        const scssCompile = src => new Promise(resolve => Sass.compile(src, resolve));
        const getLogicalPath = scriptTag => scriptTag.attributes["src"].value.replace(new RegExp(`^${pathPrefix}`), "");
        
        async function getSourceOf(url)
        {
            return (await fetch(url)).text();
        }
        
        for(const script of document.querySelectorAll("script[type='text/scss+import']"))
            Sass.writeFile(getLogicalPath(script), await getSourceOf(script.src));
        
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
