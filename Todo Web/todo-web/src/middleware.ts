import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const {pathname} = req.nextUrl
    
    
    if (!token && !["/login","/register"].includes(pathname)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if(token && ["/login", "/register"].includes(pathname)){
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/register", "/login", "/edit-profile"], 
};
