import { Role } from '@maybank/types/role';
import { z, ZodIssueCode } from 'zod';

export const queryUserList = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  pic: z.string().optional(),
  role: z.number().default(0),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export type QueryUserList = z.infer<typeof queryUserList>;

export const userRegisterField = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Password don't match, please check again",
      });
    }
  });

export type UserRegisterField = z.infer<typeof userRegisterField>;

export const loginField = z.object({
  token: z.string(),
  password: z.string(),
});

export type LoginField = z.infer<typeof loginField>;

export const updatedSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(['member','staff','admin']),
  pic: z.string()
})


export type UpdatedSchema = z.infer<typeof updatedSchema>