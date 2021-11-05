import React, { useEffect, useMemo } from 'react';
// import { Button } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomTabel from 'ui/components/Tabel';
import { arrayToItems } from 'utils/arraysToComponents';
import _ from 'lodash';
import { getProjects } from './store/thunks';
import ProjectsStyleWrapper from './Projects.style';

import { defaultProjectsFilters } from './store/reducer';

const projectColumns = [
  {
    dataKey: 'title',
    columnTitle: 'Название',
  },
  {
    dataKey: 'user',
    columnTitle: 'Сотрудники',
  },
  {
    dataKey: 'technologies',
    columnTitle: 'Технологии',
  },
];

const Projects = () => {
  // const history = useHistory();
  const dispatch = useDispatch();
  const { projects, filters } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(getProjects(defaultProjectsFilters));
  }, [dispatch]);

  const paginationForTabel = useMemo(() => {
    return {
      ...filters.pagination,
      onChange: (event, page) => dispatch(getProjects(
        {
          pagination: { ...filters.pagination, page },
        },
      )),
    };
  }, [filters.pagination, dispatch]);

  const dataForTabel = useMemo(() => {
    if (_.isEmpty(projects)) {
      return;
    }

    return projects.map((project) => {
      const projectsTabelColumns = _.pick(
        project,
        projectColumns.map((projectColumn) => projectColumn.dataKey),
      );

      projectsTabelColumns.user = arrayToItems(projectsTabelColumns.user, 'login', ', ', 'a');
      projectsTabelColumns.technologies = arrayToItems(projectsTabelColumns.technologies, 'title', ', ', 'p');
      return projectsTabelColumns;
    });
  }, [projects]);

  // const handleAddProject = () => {
  //   history.push('create-project');
  // };

  return (
    <ProjectsStyleWrapper>
      <CustomTabel
        columns={projectColumns}
        data={dataForTabel}
        pagination={paginationForTabel}
        className="projects__tabel"
      />
    </ProjectsStyleWrapper>
  );
};

export default Projects;
