<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EquipmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Equipment::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'status' => [
                'required',
                Rule::in(['available', 'in use', 'broken']),
            ],
            'notes' => ['nullable', 'string'],
        ]);

        $equipment = Equipment::create($validated);

        return response()->json([
            'message' => 'Equipment created successfully.',
            'data' => $equipment,
        ], 201);
    }

    public function show(Equipment $equipment)
    {
        return response()->json($equipment);
    }

    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:0'],
            'status' => [
                'required',
                Rule::in(['available', 'in use', 'broken']),
            ],
            'notes' => ['nullable', 'string'],
        ]);

        $equipment->update($validated);

        return response()->json([
            'message' => 'Equipment updated successfully.',
            'data' => $equipment,
        ]);
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return response()->json([
            'message' => 'Equipment deleted successfully.',
        ]);
    }
}
