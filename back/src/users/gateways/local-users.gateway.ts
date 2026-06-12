// src/users/gateways/local-users.gateway.ts
import * as fs from 'fs';
import * as path from 'path';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';
import { NotFoundException } from '@nestjs/common';

export class LocalUsersGateway implements UsersGateway {
	private users: ExternalUser[];

	constructor() {
		const filePath = path.join(__dirname, '../data/users.json');
		const file = fs.readFileSync(filePath, 'utf-8');
		this.users = JSON.parse(file);
	}

	async fetchAll(): Promise<ExternalUser[]> {
		return this.users;
	}

	async fetchById(id: number): Promise<ExternalUser> {
		const user = this.users.find((u) => u.id === id);
		if (!user) throw new NotFoundException(`User ${id} not found`);
		return user;
	}
}
