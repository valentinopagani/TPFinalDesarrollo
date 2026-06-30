// src/users/gateways/local-users.gateway.ts
import * as fs from 'fs';
import * as path from 'path';
import { UsersGateway } from './users.gateway';
import { ExternalUser } from '../user.types';
import { NotFoundException } from '@nestjs/common';

export class LocalUsersGateway implements UsersGateway {
	private users: ExternalUser[];

	constructor() {
		// Resolve path relative to compiled JS (__dirname will be in dist when built)
		const filePath = path.resolve(__dirname, '..', 'data', 'users.json');
		try {
			const file = fs.readFileSync(filePath, 'utf-8');
			this.users = JSON.parse(file);
		} catch (e: any) {
			if (e.code === 'ENOENT') {
				// If file not found, initialize with empty array to avoid crash
				this.users = [];
			} else {
				throw e;
			}
		}
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
