import bcrypt from "bcryptjs";

export class BcryptService {
    private readonly saltRounds: number;

    constructor(saltRounds: number = 10) {
        this.saltRounds = saltRounds;
    }

    async encrypt(plainText: string): Promise<string> {
        return await bcrypt.hash(plainText, this.saltRounds);
    }

    async compare(plainText: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hash);
    }
}
