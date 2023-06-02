6/2 ::

불러오기 버튼을 통한 프로젝트 불러오기 구현

노드의 실행 순서를 flowId를 이용하여 workflow 구현 

ex) 94번 노드, 95번, 96번 >> [[94, 95, 96]]

불러오기를 실행했을 때 Deserialize 내용을 아래의 respose.data가 덮어써서 새로운 flowId를 할당하는 버그가 있음
이를 위해 프로젝트를 불러왔는지를 체크하여 생성하고자 메소드 init()으로 분러함
// if(this.progWorkFlowMng.flowId == -1) {
// 	axios.post(`/diagram/project/save-node/${this.progWorkFlowMng.progId}`, this.progWorkFlowMng, {maxRedirects: 0})
// 		.catch((error: any) => {
// 			console.log(error);
// 		}).then((response: AxiosResponse<string> | void) => {
// 		if (response) {
// 			this.progWorkFlowMng.flowId = parseInt(response.data);
// 		}
// 	});
// }


6/1 :: 

프로젝트 생성, 로드 및 저장 백엔드와 연결

Select, Filter 노드 백연드 연결
