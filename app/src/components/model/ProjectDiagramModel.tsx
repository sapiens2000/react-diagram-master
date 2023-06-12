import { DiagramModel, DiagramModelGenerics} from "@projectstorm/react-diagrams";


export class ProjectDiagramModel<G extends DiagramModelGenerics = DiagramModelGenerics> extends DiagramModel<G> {
    prog_mst: {
        progId: number;
        progNm: string;
        progDesc: string;
        viewAttr: {};
        useYn: boolean;
        crtdDttm: string;
        updtDttm: string;
        dltDttm: string;
	}

    getProgMst(){
        return this.prog_mst;
    }

    setProgMst(new_prog_mst: any){
        this.prog_mst = JSON.parse(JSON.stringify(new_prog_mst));
    }

    getProgId(){
        return this.prog_mst.progId;
    }

    setProgId(id: any) {
            this.prog_mst.progId = id;
    }

    setUseYn(){
        this.prog_mst.useYn = !this.prog_mst.useYn 
    }

}




