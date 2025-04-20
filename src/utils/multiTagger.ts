import path from "path"
import { PathLike, readdirSync } from "fs"
export function multiTagger(dir:PathLike){
    const files=readdirSync(dir,{withFileTypes:true})
    const AllParentPaths=new Set(files.map(file=>file.parentPath))
    const mapper=new Map()
    for (const parentPath of AllParentPaths){
        mapper.set(parentPath,{directories:new Set(files.filter(file=>file.parentPath==parentPath && file.isDirectory()==true).map(file=>file.name)),
            pdfs:new Set(files.filter(file=>file.parentPath==parentPath && path.parse(file.name).ext==".pdf").map(file=>file.name))
        })
    }
    return mapper
}