import { getProjects } from '../../lib/content';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="card hero">
        <h1>Projects</h1>
        <p>From creative tools to game-inspired experiments, these are the builds that carry the vision.</p>
      </section>

      <section className="stack-grid section-space">
        {projects.length ? (
          projects.map((project) => (
            <article key={project.id} className="card">
              {project.cover_image_url ? <img className="cover" src={project.cover_image_url} alt={project.title} /> : null}
              <h3 className="section-title">{project.title}</h3>
              <p>{project.summary}</p>
              <div className="actions">
                {project.project_url ? (
                  <a className="button primary" target="_blank" rel="noreferrer" href={project.project_url}>
                    Visit Site
                  </a>
                ) : null}
                {project.repo_url ? (
                  <a className="button" target="_blank" rel="noreferrer" href={project.repo_url}>
                    Repository
                  </a>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <article className="card">
            <p className="meta">No projects yet.</p>
          </article>
        )}
      </section>
    </>
  );
}
