// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ProjectInfoModal.css';

// interface Project {
//   id: number;
//   name: string;
// }

// interface ProjectInfoModalProps {
//   onClose: () => void;
//   onProjectSelect: (projectId: number) => void;
// }

// const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ onClose, onProjectSelect }) => {
//   const [projects, setProjects] = useState<Project[]>([]);

//   // 프로젝트 목록 가져오기
//   const fetchProjects = async () => {
//     // try {
//     //   const response = await axios.get('/diagram/projects'); // API 엔드포인트에 따라 수정
//     //   setProjects(response.data);
//     // } catch (error) {
//     //   console.log(error);
//     // }
//   };

//   // 컴포넌트가 마운트될 때 프로젝트 목록 가져오기
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // 프로젝트 선택 시 처리
//   const handleProjectSelect = (projectId: number) => {
//     // 선택한 프로젝트 불러오기 등의 로직 수행
//     // ...
//     onProjectSelect(projectId); // 선택한 프로젝트 ID 전달
//     onClose(); // 창 닫기
//   };

//   return (
//     <div>
//       <h2>프로젝트 목록</h2>
//       <ul>
//         {projects.map((project) => (
//           <li key={project.id} onClick={() => handleProjectSelect(project.id)}>
//             {project.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProjectInfoModal;

import React, { useState } from 'react';

const TestModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Modal Title</h2>
              <p>Modal Content</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModal;