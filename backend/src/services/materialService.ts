import { AppError } from '../middlewares/errorHandler';
import { materialRepository, MaterialFilters } from '../repositories/materialRepository';
import { PaginationParams, PaginatedResult, getPaginationParams, getTotalPages } from '../utils/pagination';

export const materialService = {
  async findAll(query: any): Promise<PaginatedResult<any>> {
    const filters: MaterialFilters = {
      materialType: query.materialType,
      conditionStatus: query.conditionStatus,
      thematicArea: query.thematicArea,
      search: query.search,
      availableOnly: query.availableOnly === 'true',
    };

    const pagination = getPaginationParams(query);
    const { data, total } = await materialRepository.findAll(filters, pagination);

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: getTotalPages(total, pagination.limit),
      },
    };
  },

  async findById(id: number) {
    const material = await materialRepository.findById(id);
    if (!material) {
      throw new AppError('Material não encontrado', 404);
    }
    return material;
  },

  async create(data: {
    internalCode: string;
    title: string;
    thematicArea: string;
    materialType: string;
    quantityTotal: number;
    quantityAvailable: number;
    conditionStatus: string;
  }) {
    // Check if internal code already exists
    const existing = await materialRepository.findByInternalCode(data.internalCode);
    if (existing) {
      throw new AppError('Código interno já cadastrado', 400);
    }

    // Validate quantities
    if (data.quantityAvailable > data.quantityTotal) {
      throw new AppError('Quantidade disponível não pode ser maior que a total', 400);
    }

    return materialRepository.create(data);
  },

  async update(id: number, data: Partial<{
    title: string;
    thematicArea: string;
    materialType: string;
    quantityTotal: number;
    quantityAvailable: number;
    conditionStatus: string;
  }>) {
    const material = await materialRepository.findById(id);
    if (!material) {
      throw new AppError('Material não encontrado', 404);
    }

    // Validate quantities if both are being updated
    if (data.quantityTotal !== undefined && data.quantityAvailable !== undefined) {
      if (data.quantityAvailable > data.quantityTotal) {
        throw new AppError('Quantidade disponível não pode ser maior que a total', 400);
      }
    }

    return materialRepository.update(id, data);
  },

  async delete(id: number) {
    const material = await materialRepository.findById(id);
    if (!material) {
      throw new AppError('Material não encontrado', 404);
    }

    // Check if material has active loans
    if (material.loans && material.loans.length > 0) {
      throw new AppError('Não é possível excluir material com empréstimos ativos', 400);
    }

    return materialRepository.delete(id);
  },
};

