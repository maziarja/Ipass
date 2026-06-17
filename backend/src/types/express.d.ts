declare namespace Express {
  interface Request {
    user?: {
      id: string
      email: string
      masterSalt: string | null
      masterVerify: string | null
      createdAt: Date
    }
  }
}
