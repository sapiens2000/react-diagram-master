import { useState } from "react"

const prog_work_Flow_mng = {
    flow_id : 0,
    prog_id : 0,
    flow_seq : 0,
    flow_type : "",
    flow_attr : {
    },
    flow_desc : "",
    crtd_dttm : "",
    updt_dttm : "",
}

export const prog_work_flow = () => {
    const [prog_work_flow, setWorkFlow] = useState(prog_work_Flow_mng);

    
}
