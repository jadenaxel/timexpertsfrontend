const FullName = (name: string, last_name: string): string => `${name} ${last_name}`;
const GetNameInitials = (name: string, last_name: string): string => `${name.charAt(0).toUpperCase()}${last_name.charAt(0).toUpperCase()}`;

export { FullName, GetNameInitials };
