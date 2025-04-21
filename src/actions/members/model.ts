export type Role = "member" | "admin" | "owner"

export type memberType = {
  email: string,
  role: Role,
}

export type memberTypeFull = {
  id: string,
  userId: string,
  email: string,
  role: Role,
  user: {
    name: string,
    email: string,
    image: string
  }
}