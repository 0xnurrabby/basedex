import { NextRequest, NextResponse } from "next/server";
import { turso, initDb } from "@/lib/turso";

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    let result;
    if (address && address !== "all") {
      result = await turso.execute({
        sql: `
          SELECT * FROM transactions 
          WHERE LOWER(user_address) = LOWER(?) 
          ORDER BY timestamp DESC 
          LIMIT ?
        `,
        args: [address, limit],
      });
    } else {
      result = await turso.execute({
        sql: `
          SELECT * FROM transactions 
          ORDER BY timestamp DESC 
          LIMIT ?
        `,
        args: [limit],
      });
    }

    const transactions = result.rows.map((row) => ({
      id: row.id,
      txHash: row.tx_hash,
      userAddress: row.user_address,
      tokenInSymbol: row.token_in_symbol,
      tokenInAddress: row.token_in_address,
      tokenInAmount: row.token_in_amount,
      tokenInUsd: row.token_in_usd,
      tokenOutSymbol: row.token_out_symbol,
      tokenOutAddress: row.token_out_address,
      tokenOutAmount: row.token_out_amount,
      tokenOutUsd: row.token_out_usd,
      timestamp: row.timestamp,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const {
      txHash,
      userAddress,
      tokenInSymbol,
      tokenInAddress,
      tokenInAmount,
      tokenInUsd,
      tokenOutSymbol,
      tokenOutAddress,
      tokenOutAmount,
      tokenOutUsd,
      timestamp,
    } = body;

    if (!txHash || !userAddress || !tokenInSymbol || !tokenOutSymbol) {
      return NextResponse.json(
        { success: false, error: "Missing required transaction fields" },
        { status: 400 }
      );
    }

    const txTimestamp = Number(timestamp) || Date.now();

    await turso.execute({
      sql: `
        INSERT OR REPLACE INTO transactions (
          tx_hash,
          user_address,
          token_in_symbol,
          token_in_address,
          token_in_amount,
          token_in_usd,
          token_out_symbol,
          token_out_address,
          token_out_amount,
          token_out_usd,
          timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        txHash,
        userAddress.toLowerCase(),
        tokenInSymbol,
        tokenInAddress || "",
        String(tokenInAmount || "0"),
        Number(tokenInUsd || 0),
        tokenOutSymbol,
        tokenOutAddress || "",
        String(tokenOutAmount || "0"),
        Number(tokenOutUsd || 0),
        txTimestamp,
      ],
    });

    return NextResponse.json({ success: true, message: "Transaction recorded" });
  } catch (error: any) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to record transaction" },
      { status: 500 }
    );
  }
}
