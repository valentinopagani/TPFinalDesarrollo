import axios from "axios";
import { ExternalUser } from "../user.types";
import { UsersGateway } from "./users.gateway";

export class JsonPlaceholderUsersGateway implements UsersGateway {
	async fetchAll(): Promise<ExternalUser[]> {
		const { data } = await axios.get<ExternalUser[]>(
			'https://jsonplaceholder.typicode.com/users',
		);
		return data;
	}

	fetchById(id: number): Promise<ExternalUser> {
		return axios
			.get<ExternalUser>(`https://jsonplaceholder.typicode.com/users/${id}`)
			.then(({ data }) => data);
	}
}
