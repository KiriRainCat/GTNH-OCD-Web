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

  owner_id!: number;
  owner?: User;

  data_token!: string;
}

/** 团队详情 API 数据模型 */
class TeamDetail {
  team!: Team;
  members?: User[];
}

export { User, Team, TeamDetail };
