import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import ms, {StringValue} from 'ms';

interface Payload {
    [key: string]: any;
}

class JwtService {
    private readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';

    public createToken(payload: Payload, expiresIn: StringValue | number = '1h'): string {
        const options: SignOptions = { expiresIn };
        return jwt.sign(payload, this.JWT_SECRET, options);
    }

    public decodeToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
        } catch (err) {
            return null;
        }
    }

    public decodeWithoutVerify(token: string): JwtPayload | null {
        return jwt.decode(token) as JwtPayload | null;
    }
}

export default JwtService;
