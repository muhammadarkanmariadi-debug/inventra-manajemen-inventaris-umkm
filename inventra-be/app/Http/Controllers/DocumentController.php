<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * List all documents for the current business.
     */
    public function index(Request $request)
    {
        try {
        $bussinessId = auth()->guard('api')->user()->bussiness_id;
        $perPage = (int) $request->query('items', 10);

        $query = Document::where('bussiness_id', $bussinessId)
            ->with('generatedBy')
            ->orderBy('created_at', 'desc');

        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        $documents = $query->paginate($perPage);

        return ApiHelper::success('Documents retrieved successfully', $documents, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Store a newly generated document.
     * Expects multipart form data with 'file' (PDF blob), 'type', 'title', and optional 'metadata'.
     */
    public function store(Request $request)
    {
        try {
        $request->validate([
            'file'     => 'required|file|mimes:pdf|max:10240',
            'type'     => 'required|string|in:LPB,BAR,SJ,LBB,LRS',
            'title'    => 'required|string|max:255',
            'metadata' => 'nullable|json',
        ]);

        $user = auth()->guard('api')->user();
        $bussinessId = $user->bussiness_id;

        // Generate document number: TYPE-YYMM-XXXX
        $prefix = $request->input('type');
        $yearMonth = now()->format('Y-m');
        $count = Document::where('type', $prefix)
            ->where('bussiness_id', $bussinessId)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();
        $documentNumber = $prefix . '-' . str_replace('-', '', $yearMonth) . '-' . str_pad($count + 1, 4, '0', STR_PAD_LEFT);

        // Store PDF file
        $file = $request->file('file');
        $filename = $documentNumber . '_' . Str::random(8) . '.pdf';
        $path = $file->storeAs('documents/' . $bussinessId, $filename, 'public');

        $document = Document::create([
            'document_number' => $documentNumber,
            'type'            => $prefix,
            'title'           => $request->input('title'),
            'file_path'       => $path,
            'generated_by'    => $user->id,
            'bussiness_id'    => $bussinessId,
            'metadata'        => $request->input('metadata') ? json_decode($request->input('metadata'), true) : null,
        ]);

        event(new LoggingEvent('Document ' . $document->document_number . ' saved successfully.', 'documents'));

        return ApiHelper::success('Document saved successfully', $document->load('generatedBy'), 201);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single document.
     */
    public function show($id)
    {
        try {
        $bussinessId = auth()->guard('api')->user()->bussiness_id;

        $document = Document::with('generatedBy')
            ->where('id', $id)
            ->where('bussiness_id', $bussinessId)
            ->first();

        if (!$document) {
            return ApiHelper::error('Document not found', 404);
        }

        return ApiHelper::success('Document retrieved successfully', $document, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Download the PDF file for a document.
     */
    public function download($id)
    {
        try {
        $bussinessId = auth()->guard('api')->user()->bussiness_id;

        $document = Document::where('id', $id)
            ->where('bussiness_id', $bussinessId)
            ->first();

        if (!$document) {
            return ApiHelper::error('Document not found', 404);
        }

        if (!Storage::disk('public')->exists($document->file_path)) {
            return ApiHelper::error('File not found on server', 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->document_number . '.pdf');
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a document.
     */
    public function destroy($id)
    {
        try {
        $bussinessId = auth()->guard('api')->user()->bussiness_id;

        $document = Document::where('id', $id)
            ->where('bussiness_id', $bussinessId)
            ->first();

        if (!$document) {
            return ApiHelper::error('Document not found', 404);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        event(new LoggingEvent('Document ' . $document->document_number . ' deleted successfully.', 'documents'));

        return ApiHelper::success('Document deleted successfully', null, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }
}
