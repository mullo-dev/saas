export type memberType = {
  userId: string,
  role: string,
}

export type memberTypeFull = {
  userId: string,
  role: string,
  user: {
    name: string,
    email: string,
  }
}