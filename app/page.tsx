import { getAllPosts, getAllProjects } from "../lib/content"
import { Home } from "../components/home"

export default function Page() {
  return <Home posts={getAllPosts()} projects={getAllProjects()} />
}
