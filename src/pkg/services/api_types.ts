/** 用户 API 数据模型 */
class User {
  id!: number;
  email!: string;
  username!: string;
  avatar?: string;

  teams?: string[];

  active_at?: string;
}

/** 团队 API 数据模型 */
class Team {
  id!: string;
  name!: string;
  members?: User[];
}

export { User, Team };
