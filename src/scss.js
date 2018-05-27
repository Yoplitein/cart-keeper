/*
    Compiles SCSS files on-the-fly in the browser. Minimal example:
    
    <!DOCTYPE html>
    <html>
    <head>
        <!-- Strips content from the head of imported SCSS files to calculate the logical path. Optional. -->
        <meta name="scss-prefix" content="src">
        
        <!-- Dependencies and this script. -->
        <script src="https://unpkg.com/sass.js@0.10.9/dist/sass.js"></script>
        <script src="https://unpkg.com/sass.js@0.10.9/dist/sass.worker.js"></script>
        <script src="compile-scss.js"></script>
        
        <!-- Add stylesheets like so: -->
        <script type="text/scss" src="src/style.scss"></script>
        <script type="text/scss+import" src="src/imported.scss"></script>
    <head>
    <body>
        <!-- ... -->
    </body>
    </html>
*/
document.addEventListener(
    "DOMContentLoaded",
    async function()
    {
        const pathPrefix = (document.querySelector("meta[name='scss-prefix']") || {"content": ""}).content;
        const scssCompile = src => new Promise(resolve => Sass.compile(src, resolve));
        const getLogicalPath = scriptTag => scriptTag.attributes["src"].value.replace(new RegExp(`^${pathPrefix}`), "");
        const getSourceOf = async url => (await fetch(url)).text();
        
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
