export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  updated_at: string
  private: boolean
  html_url: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface ProjectFormData {
  name: string
  description: string
  repositoryUrl: string
}

export const initialFormData: ProjectFormData = {
  name: '',
  description: '',
  repositoryUrl: '',
}
