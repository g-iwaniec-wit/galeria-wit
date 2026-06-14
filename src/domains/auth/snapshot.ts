export type AuthUser = {
	id: string;
	name: string;
	email: string;
	image: string | null;
};

export type AuthSnapshot = {
	user: AuthUser | null;
};

export type AuthSessionLike = {
	user?: {
		id: string;
		name: string;
		email: string;
		image?: string | null;
	} | null;
} | null;

export function authSnapshotFromSession(
	session: AuthSessionLike | undefined,
): AuthSnapshot {
	const user = session?.user;

	if (!user) {
		return { user: null };
	}

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image ?? null,
		},
	};
}
