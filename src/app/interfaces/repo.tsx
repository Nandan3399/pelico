export interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  repositoryTopics: RepositoryTopics;
  owner: Owner;
  cursor:string;
}

export interface RepositoryTopics {
  nodes: Node[];
}

export interface Node {
  topic: Topic;
}

export interface Topic {
  name: string;
}

export interface Owner {
  avatarUrl: string;
}
